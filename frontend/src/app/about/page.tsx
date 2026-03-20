import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
            <div className="max-w-2xl w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-md overflow-hidden">
                
                <div className="relative w-full h-80">
                    <Image
                        src="/images/Gemini_Generated_Image_f7jjiwf7jjiwf7jj.png"
                        alt="Alice"
                        fill
                        className="object-cover object-top"
                    />
                </div>

                <div className="p-10 flex flex-col gap-6">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        About Alice
                    </h1>

                    <div className="flex flex-col gap-4 text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                        <p>
                            Hi, I'm Alice — a professional chef with over ten years of experience 
                            in Indian cuisine. I grew up surrounded by the aromas of cardamom, 
                            turmeric and slow-cooked curries, and that love for bold, layered 
                            flavours has shaped everything I do in the kitchen.
                        </p>
                        <p>
                            After working at several Indian restaurants across Stockholm and Mumbai, 
                            I wanted to bring those recipes closer to home — your home. Whether 
                            you're a complete beginner or a seasoned cook, my recipes are designed 
                            to be approachable, authentic and deeply satisfying.
                        </p>
                        <p>
                            Every dish here tells a story. I hope you find something that inspires 
                            you to tie on your apron, turn up the heat, and cook something 
                            truly wonderful.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}