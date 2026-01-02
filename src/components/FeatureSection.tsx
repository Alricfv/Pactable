import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  {
    step: '1',
    title: 'Choose a Template',
    description: 'Pick from ready-made templates for common situations.'
  },
  {
    step: '2',
    title: 'Customize Terms',
    description: 'Edit the terms and add participants by email.'
  },
  {
    step: '3',
    title: 'Sign Together',
    description: 'Everyone reviews and signs from any device.'
  },
  {
    step: '4',
    title: 'Access Anytime',
    description: 'Your agreements are always in your dashboard.'
  }
]

const templates = [
  {
    title: "Housemate Agreement",
    description: "Rent, chores, guests, and quiet hours"
  },
  {
    title: "Freelance Project",
    description: "Scope, payment, and deliverables"
  },
  {
    title: "Group Project",
    description: "Roles, responsibilities, and deadlines"
  },
  {
    title: "Loaning Items",
    description: "What, when, and condition of return"
  }
]

const features = [
  {
    title: "Ready-to-Use Templates",
    description: "Professionally written templates you can customize in minutes."
  },
  {
    title: "Invite Anyone",
    description: "Add participants by email. They sign without creating an account."
  },
  {
    title: "E-Signatures",
    description: "Legally valid electronic signatures with timestamps."
  },
  {
    title: "Clear & Simple",
    description: "Plain language agreements everyone can understand."
  }
]

export function FeatureSection() {
  return (
    <div id="features" className="bg-background py-32 border-t border-neutral-900/50">
      <div className="mx-auto max-w-6xl px-6">

        {/* How it Works - Modular Layout */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Process</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Four simple steps to clarity
              </h2>
            </div>
            <p className="text-neutral-500 max-w-xs">
              We've stripped away the complexity to help you focus on what matters: the agreement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900/50 border border-neutral-900/50 rounded-2xl overflow-hidden">
            {steps.map((step) => (
              <div key={step.step} className="bg-background p-8 hover:bg-neutral-900/30 transition-colors duration-500 group">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-bold mb-6 group-hover:border-neutral-700 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-lg font-medium text-white mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Templates - Balanced Grid */}
        <div className="mb-32">
          <div className="mb-12">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Library</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">
              Start with a template
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.title}
                className="p-6 rounded-xl border border-neutral-900 bg-neutral-900/20 hover:border-neutral-800 hover:bg-neutral-900/40 transition-all duration-300 group cursor-default"
              >
                <h3 className="text-base font-medium text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features - Clean & Grounded */}
        <div className="mb-32">
          <div className="mb-12">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">
              Everything you need
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 hover:border-neutral-800 transition-colors duration-500"
              >
                <h3 className="text-lg font-medium text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - Human Touch */}
        <div className="text-center py-20 rounded-3xl bg-neutral-900/20 border border-neutral-900/50">
          <p className="text-xl text-neutral-400 mb-10 max-w-md mx-auto">
            Make clearer agreements today.
          </p>
          <Link href="/signup">
            <Button className="h-12 rounded-lg px-10 text-base font-medium bg-white text-black hover:bg-neutral-200 transition-all duration-300 active:scale-95 shadow-xl shadow-white/5">
              Create your first agreement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}