import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { useAppContext } from "@/context/AppContext";

type DocumentUploadProps = {
    hirerID: number;
    existingDocs?: any; 
    refreshDocuments: () => Promise<void>;
}

export function DocumentUpload({hirerID,  existingDocs, refreshDocuments}: DocumentUploadProps) {

    const {showToast} = useToast();
    const { setCredibilityScore } = useAppContext();

    //file states
    const [driversLicense, setDriversLicense] = useState<File | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<File| null>(null); 
    const [businessFile, setBusinessFile] = useState<File | null>(null);
     
    const [isBusiness, setIsBusiness] = useState(false); 

    //validation errors
    const [errors, setErrors] = useState({
        driversLicense: "",
        insurance: "",
        business: "",
    });

    //resrot checkbox state from backend 
    useEffect( () => {
        if(existingDocs) {
            setIsBusiness(existingDocs.isBusiness ?? false); 
        }
    }, [existingDocs])

    //function for validating files
    const validateFile = (file: File, allowedTypes: string [], 
        field: "driversLicense" | "insurance" | "business", 
        maxSizeMB? : number )  => {

            //checking file type 
            if(!allowedTypes.includes(file.type)) {
                
                setErrors( prev => ({
                    ...prev,
                    [field]: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`
                })); 

                return false; 
            }

            //checking file size
            if(maxSizeMB){
                //5MB
                const maxBytes = maxSizeMB * 1024 * 1024;
                
                if(file.size > maxBytes || file.size === 0) {
                    setErrors( prev => ({
                        ...prev, 
                        [field]: `File must be smaller than ${maxSizeMB}MB and cannot be empty`
                    }))

                    return false; 
                }
            }

            //clearing errors if valud
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));

            return true;

        };

        //clearing error helper
        const clearError = (field: keyof typeof errors) => {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            })); 
        }

        //uploading documents
        const handleSaveDocs = async () => {
            //checking validation errros
            const hasErrors = Object.values(errors).some(err => err !== "");

            if(hasErrors) {
                showToast("Please fix the errors before saving.", "error"); 
                return; 
            }

            try {
                //formdata for multipart upload
                const formData = new FormData(); 

                //appending only if uploaded
                if(driversLicense) {
                    formData.append("driversLicense", driversLicense);
                }
                
                if (insuranceFile) {
                formData.append("insuranceCertificate", insuranceFile);
                }

                if (businessFile) {
                    formData.append("businessRegistration", businessFile);
                }
                //appending isBusiness
                formData.append("isBusiness", String(isBusiness));

                //api call to upload
                await axios.post(
                    `http://localhost:3001/users/${hirerID}/documents`,
                    formData,
                    
                );

                await refreshDocuments();

                showToast("Documents saved successfully", "success");

                //setting credibility score to Appcontext  
                const credibilityResponse = await axios.get(
                    `http://localhost:3001/users/${hirerID}/credibility`
                );

                setCredibilityScore(
                    credibilityResponse.data.credibilityScore
                );

            } catch(error) {
                console.log(error);
                //showing toast upon error
                showToast(
                    "Something went wrong while saving documents.",
                    "error"
                );
            }
           
        }


        return (
            <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

                    <h2 className="text-xl font-semibold text-[#3B22A1]">
                        Documents
                    </h2>

                    {/* Driver License */}
                    <div>

                        <label className="text-sm font-medium text-gray-600">
                            Drivers Licence (.jpg only, max 2MB)
                        </label>
                        {existingDocs?.driversLicense ? (
                            <p className="text-sm mt-1 text-green-600">
                                Driver License uploaded (you can replace it below)
                            </p>
                        ) : (
                            <p className="text-sm mt-1 text-gray-400">
                                No file uploaded
                            </p>
                        )}
                        <input
                            type="file"
                            className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                            onChange={(e) => {

                                const file = e.target.files?.[0];

                                if (!file) {
                                    clearError("driversLicense");
                                    return;
                                }

                                if (
                                    !validateFile(
                                        file,
                                        ["image/jpeg"],
                                        "driversLicense",
                                        2
                                    )
                                ) return;

                                // storing actual file object
                                setDriversLicense(file);
                            }}
                        />
                        

                        {errors.driversLicense && (
                            <p className="text-sm text-red-600 mt-2">
                                {errors.driversLicense}
                            </p>
                        )}

                    </div>

                    {/* Insurance */}
                    <div>

                        <label className="text-sm font-medium text-gray-600">
                            Insurance Certificate (.pdf only)
                        </label>
                        {existingDocs?.insuranceCertificate ? (
                            <p className="text-sm mt-1 text-green-600">
                                Insurance Certificate uploaded (you can replace it below)
                            </p>
                        ) : (
                            <p className="text-sm mt-1 text-gray-400">
                                No file uploaded
                            </p>
                        )}
                        <input
                            type="file"
                            className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                            onChange={(e) => {

                                const file = e.target.files?.[0];

                                if (!file) {
                                    clearError("insurance");
                                    return;
                                }

                                if (
                                    !validateFile(
                                        file,
                                        ["application/pdf"],
                                        "insurance"
                                    )
                                ) return;

                                setInsuranceFile(file);
                            }}
                        />
                        

                        {errors.insurance && (
                            <p className="text-sm text-red-600 mt-2">
                                {errors.insurance}
                            </p>
                        )}

                    </div>

                    {/* Business Checkbox */}
                    <div className="flex items-center gap-3">

                        <label>

                            <input
                                type="checkbox"
                                checked={isBusiness}
                                onChange={() => setIsBusiness(!isBusiness)}
                                className="w-4 h-4 accent-[#736CED]"
                            />

                            <span className="text-sm text-gray-600 ml-1">
                                I am registering as a business
                            </span>

                        </label>

                    </div>

                    {/* Business Registration */}
                    {isBusiness && (

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Business Registration (.pdf only)
                            </label>
                            {existingDocs?.businessRegistration ? (
                                <p className="text-sm mt-1 text-green-600">
                                    Business Registration uploaded (you can replace it below)
                                </p>
                            ) : (
                                <p className="text-sm mt-1 text-gray-400">
                                    No file uploaded
                                </p>
                            )}
                            <input
                                type="file"
                                className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                                onChange={(e) => {

                                    const file = e.target.files?.[0];

                                    if (!file) {
                                        clearError("business");
                                        return;
                                    }

                                    if (
                                        !validateFile(
                                            file,
                                            ["application/pdf"],
                                            "business"
                                        )
                                    ) return;

                                    setBusinessFile(file);
                                }}
                            />

                            

                            {errors.business && (
                                <p className="text-sm text-red-600 mt-2">
                                    {errors.business}
                                </p>
                            )}

                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end">

                        <button
                            onClick={handleSaveDocs}
                            className="bg-[#736CED] text-white px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#5f59d9] hover:shadow-md transition-all"
                        >
                            Save Documents
                        </button>

                    </div>

                </div>
            </>
    
        ); 




}