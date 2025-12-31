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
    <div id="features" className="bg-black py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* How it Works */}
        <div className="text-center mb-20">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-medium text-white mb-6">
            Four simple steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 text-neutral-400 text-sm font-medium mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-medium text-white">
              Start with a template
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.title}
                className="p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <h3 className="text-base font-medium text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-neutral-500">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-medium text-white">
              Everything you need
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-neutral-800"
              >
                <h3 className="text-base font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-neutral-900">
          <p className="text-lg text-neutral-400 mb-6">
            Ready to get started?
          </p>
          <Link href="/signup">
            <Button className="h-12 rounded-lg px-8 text-base font-medium bg-white text-black hover:bg-neutral-200 transition-colors">
              Create your first agreement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}