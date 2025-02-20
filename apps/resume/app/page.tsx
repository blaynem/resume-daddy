import Link from 'next/link';
import { Examples } from './examples';
import FancyBG from '../wrappers/fancy-bg';

export default function Example() {
  return (
    <FancyBG>
      <div className="px-6 pt-8 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Your Resume Daddy is waiting...{' '}
              <Link
                href="/learn-more"
                className="font-semibold text-indigo-600"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Writing a Resume is hard
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {`but it doesn't have to be`}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signin"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                <Link href="/learn-more">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </a>
            </div>
          </div>
        </div>
        {/* <div className="py-16">
          <Examples />
        </div> */}
      </div>
    </FancyBG>
  );
}
