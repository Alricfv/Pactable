'use client'

const useCases = [
    {
        title: "Housemates",
        description: "Set expectations about rent, chores, guests, and quiet hours before any misunderstandings happen.",
        icon: "🏠"
    },
    {
        title: "Freelancers",
        description: "Define scope, payment terms, and deadlines upfront. Get everything in writing before you start.",
        icon: "💼"
    },
    {
        title: "Students",
        description: "Assign roles and responsibilities so everyone knows what they're accountable for.",
        icon: "📚"
    },
    {
        title: "Friends & Family",
        description: "Loan your camera, car, or console with peace of mind. Document everything clearly.",
        icon: "🤝"
    }
]

export function UseCasesSection() {
    return (
        <section id="use-cases" className="bg-stone-50 py-20 sm:py-28">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
                        Use Cases
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
                        Built for real situations
                    </h2>
                    <p className="text-stone-500 max-w-lg mx-auto">
                        Whether you're moving in with roommates or lending something to a friend.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {useCases.map((useCase) => (
                        <div
                            key={useCase.title}
                            className="bg-white p-8 rounded-2xl border border-stone-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 group"
                        >
                            <span className="text-4xl mb-5 block">{useCase.icon}</span>
                            <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                                {useCase.title}
                            </h3>
                            <p className="text-stone-500 leading-relaxed">
                                {useCase.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
