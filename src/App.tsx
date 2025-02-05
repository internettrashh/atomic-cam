import { ConnectButton, useConnection } from '@arweave-wallet-kit/react'
import { useEffect, useRef, useState } from 'react'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [photoTaken, setPhotoTaken] = useState<string | null>(null)
  const { connected } = useConnection()

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 2048, height: 2048 },
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
        <div className="text-white text-lg p-6 bg-black/30 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 transition-all hover:translate-x-2">
              <span className="text-2xl font-bold text-neutral-400">1</span>
              <span className="font-bold text-red-400 text-xl">Color</span>
              <span className="font-light">your sheet</span>
            </div>
            <div className="flex items-center space-x-3 transition-all hover:translate-x-2">
              <span className="text-2xl font-bold text-neutral-400">2</span>
              <span className="font-bold text-blue-400 text-xl">Scan</span>
              <span className="font-light">your sheet</span>
            </div>
            <div className="flex items-center space-x-3 transition-all hover:translate-x-2">
              <span className="text-2xl font-bold text-neutral-400">3</span>
              <span className="font-bold text-green-300 text-xl">Mint</span>
              <span className="font-light">your own</span>
              <span className="font-bold text-purple-400">Atomic Asset</span>
            </div>
          </div>
        </div>
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
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              // transform: 'scaleX(-1)',  // Mirror the front camera if needed
              objectFit: 'contain',
              objectPosition: 'center'
            }}
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
            <ConnectButton />

            <button
              disabled={!connected}
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white disabled:opacity-50 flex items-center justify-center"
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
