import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon, DocumentTextIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

const steps = [
  {
    step: '1',
    title: 'Choose a Template',
    description: 'Select from our library of agreement templates for common scenarios.'
  },
  {
    step: '2', 
    title: 'Invite Participants',
    description: 'Add participant email addresses and customize the agreement terms.'
  },
  {
    step: '3',
    title: 'Sign Electronically', 
    description: 'All parties review and sign the agreement with legally valid e-signatures.'
  },
  {
    step: '4',
    title: 'Manage Your Agreements',
    description: 'Track signature status and access your agreements anytime from your dashboard.'
  }
]

const bentoFeatures = [
  {
    title: "Ready-to-Use Templates",
    description: "Choose from curated templates for freelance work, roommate agreements, and group projects.",
    icon: DocumentTextIcon,
    className: "md:col-span-2",
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    title: "Real-time Collaboration",
    description: "Invite participants and collaborate on agreement terms in real-time.",
    icon: UserGroupIcon,
    className: "md:col-span-1",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "E-Signatures",
    description: "Legally valid electronic signatures with timestamp verification.",
    icon: CheckCircleIcon,
    className: "md:col-span-1",
    gradient: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "Legally Sound",
    description: "Our templates are designed to be clear and enforceable for common informal agreements, providing a solid foundation for your arrangements.",
    icon: LockClosedIcon,
    className: "md:col-span-2",
    gradient: "from-purple-500/20 to-pink-500/20"
  }
]

export function FeatureSection() {
  return (
    <div id="features" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* How it Works Section */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-base font-semibold text-indigo-400">Simple Process</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            How it Works
          </p>
          <p className="mt-6 text-lg text-gray-300">
            Create, sign, and manage agreements in four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto max-w-5xl mb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Title */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-400">Powerful Features</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything you need for agreements
          </p>
          <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
            From template selection to final signatures, Pactable streamlines every step of the agreement process.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {bentoFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${feature.gradient} border border-gray-800 p-8 hover:border-gray-600 transition-all duration-300 ${feature.className}`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Subtle animation dot */}
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-gray-700 p-8">
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-white mb-2">Ready to get started?</h3>
              <p className="text-gray-300">Create your first agreement in under 2 minutes.</p>
            </div>
            <Link href="/signup" className="shrink-0">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}