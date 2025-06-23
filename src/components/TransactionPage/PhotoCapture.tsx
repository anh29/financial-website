import React, { useRef, useState, useCallback } from 'react'
import { FaCamera, FaRedo, FaCheck, FaTimes } from 'react-icons/fa'
import styles from './PhotoCapture.module.css'

interface PhotoCaptureProps {
  onPhotoCapture: (file: File) => void
  onClose: () => void
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotoCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not available on this browser or connection. Please use a secure (HTTPS) connection.')
        setIsLoading(false)
        return
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  // const capturePhoto = useCallback(() => {
  //   if (videoRef.current && canvasRef.current) {
  //     const video = videoRef.current
  //     const canvas = canvasRef.current
  //     const context = canvas.getContext('2d')

  //     if (context) {
  //       // Set canvas dimensions to match video
  //       canvas.width = video.videoWidth
  //       canvas.height = video.videoHeight

  //       // Draw video frame to canvas
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height)

  //       // Convert to blob
  //       canvas.toBlob((blob) => {
  //         if (blob) {
  //           const file = new File([blob], `receipt_${Date.now()}.jpg`, {
  //             type: 'image/jpeg'
  //           })
  //           setCapturedImage(URL.createObjectURL(blob))
  //           onPhotoCapture(file)
  //         }
  //       }, 'image/jpeg', 0.8)
  //     }
  //   }
  // }, [onPhotoCapture])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    if (!stream) {
      startCamera()
    }
  }, [stream, startCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setCapturedImage(URL.createObjectURL(file))
      onPhotoCapture(file)
    }
  }, [onPhotoCapture])

  React.useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [startCamera, stopCamera])

  if (capturedImage) {
    return (
      <div className={styles.photoCaptureContainer}>
        <div className={styles.photoCaptureContent}>
          <div className={styles.photoCaptureHeader}>
            <h3>📸 Ảnh Biên Lai</h3>
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          
          <div className={styles.capturedImageContainer}>
            <img src={capturedImage} alt="Captured receipt" className={styles.capturedImage} />
          </div>
          
          <div className={styles.photoActions}>
            <button className={styles.retakeButton} onClick={retakePhoto}>
              <FaRedo />
              <span>Chụp lại</span>
            </button>
            <button className={styles.confirmButton} onClick={onClose}>
              <FaCheck />
              <span>Xác nhận</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.photoCaptureContainer}>
      <div className={styles.photoCaptureContent}>
        <div className={styles.photoCaptureHeader}>
          <h3>📸 Chụp Ảnh Biên Lai</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.cameraContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Đang khởi động camera...</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.videoPreview}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
        </div>

        <div className={styles.photoActions}>
          <label className={styles.uploadButton}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <FaCamera />
            <span>Chọn ảnh</span>
          </label>
          
          {/* <button 
            className={styles.captureButton} 
            onClick={capturePhoto}
            disabled={!stream || isLoading}
          >
            <FaCamera />
            <span>Chụp ảnh</span>
          </button> */}
        </div>

        <div className={styles.instructions}>
          <p>📱 Đặt biên lai trong khung hình và chụp ảnh</p>
          <p>💡 Đảm bảo ảnh rõ nét để có kết quả tốt nhất</p>
        </div>
      </div>
    </div>
  )
}

export default PhotoCapture 