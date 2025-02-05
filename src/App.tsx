import { useEffect, useRef, useState } from 'react'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [photoTaken, setPhotoTaken] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  useEffect(() => {
    startCamera()

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const handleCancel = () => {
    setPhotoTaken(null)
    startCamera() // Restart the camera feed
  }

  const takePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0)
    const photoUrl = canvas.toDataURL('image/jpeg')
    setPhotoTaken(photoUrl)
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      {/* Camera viewport */}
      <div className="flex-1 relative bg-neutral-900">
        {photoTaken ? (
          <img
            src={photoTaken}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex items-center justify-between px-8">
        {photoTaken ? (
          <>
            {/* Cancel button */}
            <button
              onClick={handleCancel}
              className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Confirm button */}
            <button
              onClick={() => {
                // Handle photo confirmation here
                console.log('Photo confirmed:', photoTaken)
              }}
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            <button
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white"></div>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
