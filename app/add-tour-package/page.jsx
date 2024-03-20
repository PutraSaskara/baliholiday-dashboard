import Link from 'next/link'

function page() {
  return (
    <div className='h-[90vh] flex justify-center items-center'>
      <div className=''>

      <h1 className='text-3xl text-center'>Please Start from Add Tour</h1>
      <div className='flex justify-center left-0 right-0 top-56'>
      <Link href={'/add-tour-package/add-tour'} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 left-0 right-0 transition-transform duration-500 ease-in-out transform hover:scale-105">
    <h1 className='text-5xl p-5'>Add Tour</h1>
</Link>

      </div>
      </div>
      
    </div>
  )
}

export default page