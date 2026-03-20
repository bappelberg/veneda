const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";


interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { skipAuth = false, headers: customHeaders, ...rest } = options;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((customHeaders as Record<string, string>) || {}),
    };

    if (!skipAuth) {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }
    let response = await fetch(`${API_BASE}${endpoint}`, {
        headers,
        ...rest,
    });
    // If 404 -try refresh
    if (response.status === 401 && !skipAuth) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
            response = await fetch(`${API_BASE}${endpoint}`, {
                headers,
                ...rest
            });
        }
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T;
    }
    return response.json();
}

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
            return false;
        }
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
    } catch (error) {
        return false;
    }
}

