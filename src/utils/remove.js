const remove = (list, keys) =>
  list.reduce((acc, curr) => {
    console.log(curr);
    keys.forEach((ele) => delete curr._doc[ele]);
    acc[curr.type] = curr._doc;

    // Object.keys(curr._doc)
    //   .filter((key) => !keys.includes(key))
    //   .reduce((obj, key) => {
    //     console.log(key, obj, curr);
    //     obj[key] = curr[key];
    //     return obj;
    //   }, {});
    return acc;
  }, {});

module.exports = remove;
