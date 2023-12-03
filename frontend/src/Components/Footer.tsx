function Footer() {
  return (
    <>
      <div className="border-t border-gray-200 justify-center items-center py-4">
        <div className="flex items-center justify-center mt-3">
          <img
            className="mr-1 h-6 sm:h-9"
            alt="logo"
            src={process.env.PUBLIC_URL + '/image/dawat_logo_p.png'}
          />
          <p className="text-center text-2xl mb-2">DAWAT</p>
        </div>
        <p className="text-center text-gray-400 mb-3">ⓒ2023. DAWAT. All rights reserved.</p>
      </div>
    </>
  );
}

export default Footer;