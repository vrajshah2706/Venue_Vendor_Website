//store current user sessison (id, role, )
import { createContext, useContext, useEffect, useState } from "react";

export type CurrentUser = {
    id: number;
    role: "vendor" | "hirer"; 
    name: string;
}

export type Keyword = {
    id: number;
    name: string;
};

type VenueKeyword = {
    id: number;
    keyword: {
        id: number;
        name: string;
    };
};

export type Venue = { 
    id: number;
    name: string; 
    type: string; 
    location:string; 
    capacity: number; 
    price: number; 
    image: string
    isActive: boolean;
    isFeatured: boolean ;
    venueKeywords?: VenueKeyword[];
    vendor: {
     id: number;
    };
}

export type Vendor = {
    id: number;
    name: string; 
    email: string;
    password: string;
    phoneNumber?: string; 
  
}; 

export type Application = {
  id: number;
  hirer: {
    id: number;
    name: string;
  };
  venue: Venue;
  numberOfGuests: number;
  startDateTime: string;
  duration: number;
  createdAt: string; 
  comment?: string;
  status: "pending" | "approved" | "rejected";
};


export type UnavailableSlot =  {
    id: number; 
    venueID: number; 
    from: string; 
    to: string; 
}

export type Hirer = {
    id: number; 
    name: string;
    email: string;
    password: string; 
    phoneNumber?: string; 
    createdAt: string; 
};

export type PreviousHire = {
    id: number;
    eventName: string;
    date: string;
    rating: number;

    venue: {
        name: string;
        location: string;
    };
};

export type Documents = {
    driversLicense?: string;
    insuranceCertificate?: string;
    businessRegistration?: string;
    isBusiness?: boolean;
};

export type VenuePreference = {
    id: number;
    hirerID: number;
    venueID: number;
    rank: number;
    addedAt: string;
};


type AppContextType = {
    currentUser: CurrentUser | null; 
    setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
    logout: () => void; 
    credibilityScore: number | null;
    setCredibilityScore: React.Dispatch<
        React.SetStateAction<number | null>
    >;
};
//creating context now
const AppContext = createContext<AppContextType | null>(null);

//creating provider that will wrap the pages/app for shared data via context
export const AppProvider = ( { children }:  {children: React.ReactNode } ) => {
    
    const [credibilityScore, setCredibilityScore] = useState<number | null>(null);
    const [currentUser, setCurrentUser ] = useState<CurrentUser | null> (null);

    //loading data n converting into obj
    useEffect( () => {
        const storedUser = localStorage.getItem("currentUser");
         
        if(storedUser) {
            setCurrentUser(JSON.parse(storedUser))
        }

    }, [] );
    
    //saving to local storage automatically if state changes 
    useEffect( ()=> {
        if(currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser)); 

        }
        else{
            localStorage.removeItem("currentUser"); 
        }
    }, [currentUser])

    //function call upon logout 
    const logout= () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token"); 

    }

    //returning provider 
    return (
         <AppContext.Provider
            value={{ currentUser, setCurrentUser, logout, credibilityScore, setCredibilityScore}}> 
            {children}

        </AppContext.Provider> ); 

};

//creating custom hook 
export const useAppContext = () => {

    const context = useContext(AppContext);

    if(!context) {
        throw new Error (
            "useAppContext must be within AppProvider"
        )
    }
    //will return the "value (s)" of the provider 
    return context; 
}
