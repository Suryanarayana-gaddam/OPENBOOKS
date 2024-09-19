import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className='text-blue-600 animate-bounce relative bottom-[90px] left-7 text-6xl '>...</div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
            </div>
            <div className='absolute bottom-6 left-[-20px] font-semibold animate-pulse'>Loading...&nbsp;Please&nbsp;Wait</div>
        </div>
      </div>
  )
}

export default Loading
