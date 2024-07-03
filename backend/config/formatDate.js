// function formatDateForMySQL(dateString) {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = ('0' + (date.getMonth() + 1)).slice(-2);
//     const day = ('0' + date.getDate()).slice(-2);
//     // const hours = ('0' + date.getHours()).slice(-2);
//     // const minutes = ('0' + date.getMinutes()).slice(-2);
//     // const seconds = ('0' + date.getSeconds()).slice(-2);

//     // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     return `${year}-${month}-${day}`;
// }

function formatDateForMySQL(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

module.exports = formatDateForMySQL;