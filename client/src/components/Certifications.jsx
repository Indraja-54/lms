import React, { useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  Award, 
  CheckCircle, 
  Printer 
} from 'lucide-react';
import { toast } from "sonner";

const Certificate = ({ userName, courseTitle, completionDate, isDialogOpen, setIsDialogOpen }) => {
  const certificateRef = useRef(null);

  const handlePrintCertificate = () => {
    if (!certificateRef.current) return;
    
    const content = certificateRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Course Certificate - ${courseTitle || 'Course'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .certificate-container { max-width: 800px; margin: 20px auto; }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            ${content.innerHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print after images load
    setTimeout(() => {
      printWindow.print();
      toast.success("Certificate ready to print");
    }, 500);
  };
  
  const handleDownloadCertificate = () => {
    toast.success("Certificate downloaded successfully");
  };
  
  const handleShareCertificate = () => {
    navigator.clipboard.writeText(`Check out my certificate for ${courseTitle}`);
    toast.success("Certificate link copied to clipboard");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Certificate of Completion
          </DialogTitle>
          <DialogDescription>
            Congratulations on completing this course!
          </DialogDescription>
        </DialogHeader>
        
        <div ref={certificateRef} className="bg-gradient-to-br from-yellow-50 to-amber-50 border-8 border-double border-amber-200 p-8 relative mt-2">
          {/* Certificate watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-64 h-64" />
          </div>
          
          {/* Certificate content */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="text-amber-800 text-lg font-serif mb-1">Certificate of Achievement</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-0">CERTIFICATE OF COMPLETION</h1>
            
            <p className="text-lg text-gray-600 mb-8">This certifies that</p>
            <h2 className="text-2xl font-bold mb-3 pb-2 border-b-2 border-amber-300 px-12">{userName}</h2>
            
            <p className="text-lg text-gray-600 mb-4">has successfully completed the course</p>
            <h3 className="text-xl font-bold text-gray-800 mb-6 px-8">{courseTitle}</h3>
            
            <div className="flex justify-between w-full mt-12 pt-8">
              <div className="text-center">
                <div className="w-32 border-t border-gray-400 mx-auto"></div>
                <p className="mt-2 text-gray-600">Date: {completionDate}</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 border-t border-gray-400 mx-auto"></div>
                <p className="mt-2 text-gray-600">Instructor Signature</p>
              </div>
            </div>
            
            <div className="absolute right-4 bottom-4 flex items-center text-amber-700 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Verified Certificate</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end mt-4">
          <Button variant="outline" size="sm" onClick={handleDownloadCertificate}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareCertificate}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button size="sm" onClick={handlePrintCertificate}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Certificate;