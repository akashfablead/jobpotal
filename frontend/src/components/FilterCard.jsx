// import React, { useEffect, useState } from "react";
// import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
// import { Label } from "./ui/label";
// import { useDispatch } from "react-redux";
// import { setSearchedQuery } from "@/redux/jobSlice";

// const fitlerData = [
//   {
//     fitlerType: "Location",
//     array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
//   },
//   {
//     fitlerType: "Industry",
//     array: [
//       "Frontend Developer",
//       "Backend Developer",
//       "Full Stack Developer",
//       "Data Scientist ",
//       "Graphic Designer",
//     ],
//   },
//   {
//     fitlerType: "Salary",
//     array: ["0-40000", "40000-80000", "80000-120000", "120000-160000"],
//   },
// ];

// const FilterCard = () => {
//   const [selectedValue, setSelectedValue] = useState("");
//   const dispatch = useDispatch();
//   //   const changeHandler = (value) => {
//   //     setSelectedValue(value);
//   //   };

//   const changeHandler = (value) => {
//     setSelectedValue(value);
//     // Parse salary range if it's a salary filter
//     if (value.includes("-") && !isNaN(value.split("-")[0])) {
//       const [min, max] = value.split("-").map(Number);
//       dispatch(setSearchedQuery({ type: "salary", min, max }));
//     } else {
//       dispatch(setSearchedQuery({ type: "other", value }));
//     }
//   };

//   useEffect(() => {
//     dispatch(setSearchedQuery(selectedValue));
//   }, [selectedValue]);

//   return (
//     <div className="w-full bg-white p-3 rounded-md">
//       <h1 className="font-bold text-lg">Filter Jobs</h1>
//       <hr className="mt-3" />
//       <RadioGroup value={selectedValue} onValueChange={changeHandler}>
//         {fitlerData.map((data, index) => (
//           <div>
//             <h1 className="font-bold text-lg">{data.fitlerType}</h1>
//             {data.array.map((item, idx) => {
//               const itemId = `id${index}-${idx}`;
//               return (
//                 <div className="flex items-center space-x-2 my-2">
//                   <RadioGroupItem value={item} id={itemId} />
//                   <Label htmlFor={itemId}>{item}</Label>
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </RadioGroup>
//     </div>
//   );
// };

// export default FilterCard;

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Scientist",
      "Graphic Designer",
    ],
  },
  {
    filterType: "Salary",
    array: ["0-40000", "40000-80000", "80000-120000", "120000-160000"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const handleFilterChange = (value) => {
    setSelectedValue(value);

    // Check if the value is a salary range
    if (value.includes("-") && !isNaN(value.split("-")[0])) {
      const [min, max] = value.split("-").map(Number);
      dispatch(
        setSearchedQuery({
          type: "salary",
          value: value,
          min: min,
          max: max,
        })
      );
    } else {
      // For location and industry filters
      const filterType = filterData
        .find((category) => category.array.includes(value))
        ?.filterType.toLowerCase();

      dispatch(
        setSearchedQuery({
          type: filterType,
          value: value,
          min: null,
          max: null,
        })
      );
    }
  };

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={handleFilterChange}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-lg mt-4">{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `filter-${index}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
