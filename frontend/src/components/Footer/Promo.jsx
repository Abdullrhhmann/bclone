import React from "react";

const Promo = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-[5rem] mb-3">
      <hr className="w-full border-none sm:h-[5px] h-[2px] bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 sM;" />

      <p className="text-center sm:p-0 p-4">
        <span className="font-bold">Upgrade to Behance Pro today:&nbsp;</span>
        Get advanced analytics, a custom portfolio website, and more features to
        grow your creative career.
        <span className="font-bold text-blue2">
          &nbsp;&nbsp;Start your 7 day free trial
        </span>
      </p>
    </div>
  );
};

export default Promo;
