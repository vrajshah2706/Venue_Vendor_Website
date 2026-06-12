import Link from "next/link";

export default function Footer() {

    return (
        <>
        <footer className="bg-[#FEF9FF] text-[#736CED]">

            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* logo and socials */}
                <div>

                    {/* changed img -> next/image can be added later if needed */}
                    <img
                        src="/vv.png"
                        alt="Venue Vendor Logo"
                        className="mb-4 translate-x-[-20px] h-10 w-auto"
                    />

                    <h3 className="font-semibold mb-3 mt-5">
                        Follow Us:
                    </h3>

                    <div className="flex gap-3">

                        {/* added leading slash so public assets load correctly */}
                        <img
                            src="/instagram.svg"
                            alt="Instagram Icon"
                            className="h-6 w-6 cursor-pointer hover:opacity-70 transition"
                        />

                        <img
                            src="/twitter.svg"
                            alt="Twitter Icon"
                            className="h-6 w-6 cursor-pointer hover:opacity-70 transition"
                        />

                        <img
                            src="/facebook.svg"
                            alt="Facebook Icon"
                            className="h-6 w-6 cursor-pointer hover:opacity-70 transition"
                        />

                    </div>

                    <div className="mt-11 text-sm">

                        {/* changed typo: Terms and Condition -> Terms and Conditions */}
                        <p className="cursor-pointer hover:text-[#5f59d9] transition">
                            Privacy Policy
                        </p>

                        <p className="cursor-pointer hover:text-[#5f59d9] transition mt-2">
                            Terms and Conditions
                        </p>

                    </div>
                </div>

                {/* about section */}
                <div>

                    <h3 className="font-semibold mb-2">
                        About Us:
                    </h3>

                    <p>
                        We are a private company based in Melbourne that aims
                        to make the venue hiring process quick and seamless.
                        Our platform helps hirers easily find and book venues
                        offered by vendors.
                    </p>

                    <h3 className="font-semibold mb-1 mt-4">
                        Quick Links:
                    </h3>

                    <div className="space-y-1 text-sm">

                        <Link href="/Hirer">
                            <p className="cursor-pointer hover:text-[#5f59d9] transition">
                                Suppliers
                            </p>
                        </Link>

                        <Link href="/SignUp">
                            <p className="cursor-pointer hover:text-[#5f59d9] transition">
                                Sign Up
                            </p>
                        </Link>

                    </div>

                </div>

                {/* contact section */}
                <div>

                    <h3 className="font-semibold mb-1">
                        Contact Us:
                    </h3>

                    <h5 className="font-semibold mb-1">
                        Address:
                    </h5>

                    <p className="text-sm text-[#736CED] mb-1">
                        Building 80.01.03 RMIT University, Melbourne, VIC
                    </p>

                    <h5 className="font-semibold mb-1">
                        Email:
                    </h5>

                    <p className="text-sm text-[#736CED] mb-2">
                        contact@venuevendors.com
                    </p>

                    <p className="text-sm text-[#736CED] mb-1">
                        support@venuevendors.com
                    </p>

                    <h5 className="font-semibold mb-1">
                        Phone:
                    </h5>

                    <p className="text-sm text-[#736CED]">
                        1234567890
                    </p>

                </div>

            </div>

            {/* divider */}
            <div className="border-t border-[#D4C1EC]" />

            {/* copyright */}
            <div className="bg-[#FEF9FF] text-center py-4 text-sm text-[#736CED]">
                Copyright © 2026 RMIT University
            </div>

        </footer>
        </>
    );
}