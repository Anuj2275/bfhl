function isValidNode(str) {

    if (typeof str !== "string")
        return false;

    str = str.trim();

    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(str))
        return false;

    const [parent, child] = str.split("->");

    if (parent === child)
        return false;

    return true;

}

module.exports = {
    isValidNode
};