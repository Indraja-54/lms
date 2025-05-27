import { useState } from 'react';
import { 
  useCreatePurchaseMutation,
  useConfirmPurchaseMutation,
  useFailPurchaseMutation
} from '../services/paymentApi'; // Adjust the import path as needed

const BuyCourseButton = ({ courseDetails }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // RTK Query hooks
  const [createPurchase, { isLoading: isCreatingPurchase }] = useCreatePurchaseMutation();
  const [confirmPurchase, { isLoading: isConfirmingPurchase }] = useConfirmPurchaseMutation();
  const [failPurchase] = useFailPurchaseMutation();
  
  // Handle the click on the buy button
  const handleBuyClick = () => {
    // Clear any previous errors
    setErrorMessage('');
    
    // If it's a free preview, no confirmation needed
    if (courseDetails?.isPreviewFree) {
      handleStartFreePreview();
    } else {
      // For paid courses, show confirmation dialog
      setShowConfirmation(true);
    }
  };

  // Handle the purchase process
  const handleConfirmPurchase = async () => {
    try {
      // Step 1: Create a pending purchase record
      const purchaseResponse = await createPurchase({ 
        courseId: courseDetails._id
      }).unwrap();
      
      // Check if we got a valid paymentId
      if (!purchaseResponse || !purchaseResponse.paymentId) {
        throw new Error('Failed to create purchase record');
      }
      
      // Step 2: In a real app, you would redirect to payment gateway here
      // For this example, we'll simulate a successful payment
      
      // Step 3: Confirm the purchase after payment
      await confirmPurchase(purchaseResponse.paymentId).unwrap();
      
      // On success
      console.log("Purchase completed successfully!");
      // You might want to redirect or show a success message here
      
    } catch (error) {
      console.error("Purchase failed:", error);
      setErrorMessage(
        error.data?.message || error.data?.error || 
        "Failed to process purchase. Please try again later."
      );
      
      // If we have a paymentId but the confirmation failed, mark it as failed
      if (error.paymentId) {
        try {
          await failPurchase(error.paymentId);
        } catch (markFailedError) {
          console.error("Failed to mark purchase as failed:", markFailedError);
        }
      }
    } finally {
      // Reset confirmation state
      setShowConfirmation(false);
    }
  };

  // Free preview handler - simpler flow
  const handleStartFreePreview = async () => {
    try {
      // For free courses, we directly create and confirm the purchase
      const purchaseResponse = await createPurchase({ 
        courseId: courseDetails._id
      }).unwrap();
      
      if (purchaseResponse && purchaseResponse.paymentId) {
        await confirmPurchase(purchaseResponse.paymentId).unwrap();
        console.log("Free preview started successfully!");
      }
    } catch (error) {
      console.error("Failed to start free preview:", error);
      setErrorMessage(
        error.data?.message || error.data?.error || 
        "Failed to start free preview. Please try again."
      );
    }
  };

  // Cancel purchase
  const handleCancelPurchase = () => {
    setShowConfirmation(false);
    setErrorMessage('');
  };

  // Determine if course price is available and valid
  const hasValidPrice = courseDetails && 
    (courseDetails.coursePrice !== undefined && 
     courseDetails.coursePrice !== null && 
     courseDetails.coursePrice !== '');

  // Determine button text based on course status
  const getButtonText = () => {
    if (isCreatingPurchase || isConfirmingPurchase) {
      return "Processing...";
    }
    
    if (courseDetails?.isPreviewFree) {
      return "Start Free Preview";
    } else {
      return `Purchase for ${hasValidPrice ? `$${courseDetails.coursePrice}` : ""}`;
    }
  };

  // Check for missing required properties
  const isMissingRequiredProps = !courseDetails || !courseDetails._id;
  if (isMissingRequiredProps) {
    return (
      <div className="text-red-500">
        Course details missing required properties
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Error message display */}
      {errorMessage && (
        <div className="mb-4 p-3 w-full bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      {/* Main purchase button */}
      <button
        onClick={courseDetails?.isPreviewFree ? handleStartFreePreview : handleBuyClick}
        disabled={isCreatingPurchase || isConfirmingPurchase}
        className={`px-6 py-2 rounded-lg font-medium w-full ${
          isCreatingPurchase || isConfirmingPurchase 
            ? "bg-gray-400 cursor-not-allowed"
            : courseDetails?.isPreviewFree 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {getButtonText()}
      </button>
      
      {/* Course price debugging - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Course ID: {courseDetails._id}<br/>
          Price: {hasValidPrice ? courseDetails.coursePrice : 'Not set'}
        </div>
      )}
      
      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
            
            <div className="mb-4">
              <p className="font-medium">Course: {courseDetails?.title || courseDetails?.name}</p>
              {hasValidPrice && (
                <p>Price: ${courseDetails.coursePrice}</p>
              )}
              {courseDetails?.creator && (
                <p>Instructor: {typeof courseDetails.creator === 'object' 
                  ? courseDetails.creator.name 
                  : courseDetails.creator}
                </p>
              )}
              {courseDetails?.duration && (
                <p>Duration: {courseDetails.duration}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelPurchase}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isCreatingPurchase || isConfirmingPurchase}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className={`px-4 py-2 ${
                  isCreatingPurchase || isConfirmingPurchase
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg`}
                disabled={isCreatingPurchase || isConfirmingPurchase}
              >
                {isCreatingPurchase || isConfirmingPurchase 
                  ? "Processing..." 
                  : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCourseButton;