import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
	{
		step: "1",
		title: "Choose a Template",
		description: "Pick from ready-made templates for common situations.",
	},
	{
		step: "2",
		title: "Customize Terms",
		description: "Edit the terms and add participants by email.",
	},
	{
		step: "3",
		title: "Sign Together",
		description: "Everyone reviews and signs from any device.",
	},
	{
		step: "4",
		title: "Access Anytime",
		description: "Your agreements are always in your dashboard.",
	},
]

const templates = [
	{
		title: "Housemate Agreement",
		description: "Rent, chores, guests, and quiet hours",
		emoji: "🏠",
	},
	{
		title: "Freelance Project",
		description: "Scope, payment, and deliverables",
		emoji: "💼",
	},
	{
		title: "Group Project",
		description: "Roles, responsibilities, and deadlines",
		emoji: "📚",
	},
	{
		title: "Loaning Items",
		description: "What, when, and condition of return",
		emoji: "🤝",
	},
]

const features = [
	{
		title: "Ready-to-Use Templates",
		description:
			"Professionally written templates you can customize in minutes.",
		icon: "📋",
	},
	{
		title: "Invite Anyone",
		description:
			"Add participants by email. They sign without creating an account.",
		icon: "✉️",
	},
	{
		title: "E-Signatures",
		description: "Legally valid electronic signatures with timestamps.",
		icon: "✍️",
	},
	{
		title: "Clear & Simple",
		description: "Plain language agreements everyone can understand.",
		icon: "💡",
	},
]

export function FeatureSection() {
	return (
		<div id="features" className="bg-white py-20 sm:py-28">
			<div className="mx-auto max-w-6xl px-6">
				{/* How it Works */}
				<div className="mb-20 sm:mb-28">
					<div className="text-center mb-14">
						<span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
							How it works
						</span>
						<h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
							Four simple steps to clarity
						</h2>
						<p className="text-stone-500 max-w-lg mx-auto">
							We&apos;ve stripped away the complexity to help you focus on what
							matters.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{steps.map((step) => (
							<div
								key={step.step}
								className="relative bg-stone-50 p-6 rounded-2xl hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300 group"
							>
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold mb-5">
									{step.step}
								</div>
								<h3 className="text-lg font-semibold text-stone-900 mb-2">
									{step.title}
								</h3>
								<p className="text-sm text-stone-500 leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Templates */}
				<div className="mb-20 sm:mb-28">
					<div className="text-center mb-14">
						<span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
							Templates
						</span>
						<h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
							Start with a template
						</h2>
						<p className="text-stone-500 max-w-lg mx-auto">
							Ready-made agreements for the most common situations.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{templates.map((template) => (
							<div
								key={template.title}
								className="p-6 rounded-2xl bg-stone-50 border-2 border-stone-300 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300 group cursor-pointer"
							>
								<span className="text-3xl mb-4 block">{template.emoji}</span>
								<h3 className="text-base font-semibold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
									{template.title}
								</h3>
								<p className="text-sm text-stone-500 leading-relaxed">
									{template.description}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Features */}
				<div className="mb-20 sm:mb-28">
					<div className="text-center mb-14">
						<span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
							Features
						</span>
						<h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
							Everything you need
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="flex gap-5 p-6 rounded-2xl bg-stone-50 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
							>
								<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-2xl">
									{feature.icon}
								</div>
								<div>
									<h3 className="text-lg font-semibold text-stone-900 mb-1">
										{feature.title}
									</h3>
									<p className="text-sm text-stone-500 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA */}
				<div className="text-center py-16 px-8 rounded-3xl bg-stone-900">
					<h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
						Ready to get started?
					</h3>
					<p className="text-stone-400 mb-8 max-w-md mx-auto">
						Create your first agreement in under 5 minutes. No credit card
						required.
					</p>
					<Link href="/signup">
						<Button className="h-12 rounded-full px-8 text-base font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
							Create your first agreement
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}