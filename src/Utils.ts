export const isColorString = (strColor: string) => {
  if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(strColor)) {
    return true;
  }
  const s = new Option().style;
  s.color = strColor;
  return s.color === strColor;
};

function wait(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export function waitUntil(conditionExp: () => boolean, timeout: number = -1, interval: number = 50) {
  const countMax = timeout / interval;
  return async () => {
    let count = 0;

    while (timeout === -1 || count < countMax) {
      // console.log('waiting...' + count + '/' + countMax);
      if (conditionExp()) {
        // console.log('...done');
        return;
      }
      await wait(interval);
      count++;
    }
    // return false;
    throw new Error('Wait Finished with Timeout');
  };
}

export const convertSecondsToString = (seconds: number) => {
  const hour = ~~(seconds / 3600);
  const exceptHour = seconds % 3600;
  const minute = ~~(exceptHour / 60);
  const second = exceptHour % 60;
  return hour
    ? `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    : `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

// // #region diffObject
// interface INameToValueMap {
//   [key: string]: any;
// }

// /*!
//  * Find the differences between two objects and push to a new object
//  * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
//  * @param  {Object} obj1 The original object
//  * @param  {Object} obj2 The object to compare against it
//  * @return {Object}      An object of differences between the two
//  */
// export const diffObject = (obj1: INameToValueMap, obj2: INameToValueMap) => {
//   // Make sure an object to compare is provided
//   if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
//     return obj1;
//   }

//   const diffs: INameToValueMap = {};
//   let key;

//   /**
//    * Check if two arrays are equal
//    * @param  {Array}   arr1 The first array
//    * @param  {Array}   arr2 The second array
//    * @return {Boolean}      If true, both arrays are equal
//    */
//   const arraysMatch = (arr1: Array<any>, arr2: Array<any>): boolean => {
//     // Check if the arrays are the same length
//     if (arr1.length !== arr2.length) return false;

//     // Check if all items exist and are in the same order
//     for (let i = 0; i < arr1.length; i++) {
//       if (arr1[i] !== arr2[i]) return false;
//     }

//     // Otherwise, return true
//     return true;
//   };

//   /**
//    * Compare two items and push non-matches to object
//    * @param  {*}      item1 The first item
//    * @param  {*}      item2 The second item
//    * @param  {String} key   The key in our object
//    */
//   const compare = (item1: any, item2: any, key: string) => {
//     // Get the object type
//     const type1 = Object.prototype.toString.call(item1);
//     const type2 = Object.prototype.toString.call(item2);

//     const diffs: INameToValueMap = {};
//     // If type2 is undefined it has been removed
//     if (type2 === '[object Undefined]') {
//       diffs[key] = null;
//       return;
//     }

//     // If items are different types
//     if (type1 !== type2) {
//       diffs[key] = item2;
//       return;
//     }

//     // If an object, compare recursively
//     if (type1 === '[object Object]') {
//       const objDiff = diffObject(item1, item2);
//       if (Object.keys(objDiff).length > 1) {
//         diffs[key] = objDiff;
//       }
//       return;
//     }

//     // If an array, compare
//     if (type1 === '[object Array]') {
//       if (!arraysMatch(item1, item2)) {
//         diffs[key] = item2;
//       }
//       return;
//     }

//     // Else if it's a function, convert to a string and compare
//     // Otherwise, just compare
//     if (type1 === '[object Function]') {
//       if (item1.toString() !== item2.toString()) {
//         diffs[key] = item2;
//       }
//     } else {
//       if (item1 !== item2) {
//         diffs[key] = item2;
//       }
//     }
//   };

//   // Compare our objects

//   // Loop through the first object
//   for (key in obj1) {
//     if (obj1.hasOwnProperty(key)) {
//       compare(obj1[key], obj2[key], key);
//     }
//   }

//   // Loop through the second object and find missing items
//   for (key in obj2) {
//     if (obj2.hasOwnProperty(key)) {
//       if (!obj1[key] && obj1[key] !== obj2[key]) {
//         diffs[key] = obj2[key];
//       }
//     }
//   }

//   // Return the object of differences
//   return diffs;
// };
// // #endregion
