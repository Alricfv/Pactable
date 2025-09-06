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
    name: 'Uh-oh, You agreed to it? Deal with it.',
    description: 'Their e-signature will be on record as long as you do not change the agreement',
    icon: ServerIcon,
  },
]

export function FeatureSection() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold text-indigo-400">Deploy faster</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A better workflow
              </p>
              <p className="mt-6 text-lg text-gray-300">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                iste dolor cupiditate blanditiis ratione.
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
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={800}
            height={600}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}