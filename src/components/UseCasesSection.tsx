'use client'

const useCases = [
    {
        title: "Housemates",
        description: "Set expectations about rent, chores, guests, and quiet hours before any misunderstandings happen."
    },
    {
        title: "Freelancers",
        description: "Define scope, payment terms, and deadlines upfront. Get everything in writing before you start."
    },
    {
        title: "Students",
        description: "Assign roles and responsibilities so everyone knows what they're accountable for."
    },
    {
        title: "Friends",
        description: "Loan your camera, car, or console with peace of mind. Document everything clearly."
    }
]

export function UseCasesSection() {
    return (
        <section id="use-cases" className="bg-background py-16 sm:py-32 border-t border-neutral-900/50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header - Refined */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Context</p>
                        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-2">
                            Built for real situations
                        </h2>
                    </div>
                    <p className="text-lg text-neutral-500 max-w-sm leading-relaxed">
                        Whether you're moving in with roommates or lending something to a friend.
                    </p>
                </div>

                {/* Cards - Human Interaction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {useCases.map((useCase) => (
                        <div
                            key={useCase.title}
                            className="group relative p-10 rounded-2xl border border-neutral-900 bg-neutral-900/10 transition-all duration-500 hover:bg-neutral-900/20 hover:border-neutral-800 hover:-translate-y-1"
                        >
                            <div className="relative z-10">
                                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                                    {useCase.title}
                                </h3>
                                <p className="text-neutral-500 leading-relaxed font-normal">
                                    {useCase.description}
                                </p>
                            </div>
                            {/* Subtle border highlight on hover - human touch */}
                            <div className="absolute inset-0 rounded-2xl border border-emerald-500/0 group-hover:border-emerald-500/10 transition-colors duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
