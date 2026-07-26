export default function AdminFooter() {

    return (
        <footer
            className="
            border-t
            border-[#d9d9d8]
            bg-white
            px-6
            py-3
            text-sm
            text-[#40332a]
            "
        >

            <div className="flex items-center justify-between">

                <span>
                    © {new Date().getFullYear()} Stone Cafe
                </span>

                <span>
                    Version 1.0.0
                </span>

            </div>

        </footer>
    );
}