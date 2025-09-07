import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Speedrun your agreements!',
    description:
      'Bunch of scenarios and subjects to choose from with more coming to aid you.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Let them know YOUR terms.',
    description: 'Just invite people through their emails, get them to sign it!',
    icon: LockClosedIcon,
  },
  {
    name: 'No take-backs! Tell them to deal with it.',
    description: 'Their e-signature will be on record as long as you do not change the agreement.',
    icon: ServerIcon,
  },
]

export function FeatureSection() {
  return (
    <div className="overflow-hidden py-12 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold text-indigo-400">Automated & Quick Agreements!</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                All-in-one tool for Handshake Agreements!
              </p>
              <p className="mt-6 text-lg text-gray-300">
                Create, sign, and manage agreements effortlessly with Pactable. Whether you're sealing a deal, setting terms or safeguarding yourselves, we've got you covered.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-400 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-400" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src="https://raw.githubusercontent.com/Alricfv/imageassets/refs/heads/main/Screenshot%202025-09-07%20201813.png"
            width={800}
            height={600}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0 mt-20"
          />
        </div>
      </div>
    </div>
  )
}