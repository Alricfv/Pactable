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
        <section id="use-cases" className="bg-black py-32 border-t border-neutral-900">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Use cases</p>
                    <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
                        Built for real situations
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-xl mx-auto">
                        Whether you're moving in with roommates or lending something to a friend.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {useCases.map((useCase) => (
                        <div
                            key={useCase.title}
                            className="p-8 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
                        >
                            <h3 className="text-lg font-medium text-white mb-3">
                                {useCase.title}
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                {useCase.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
