const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'Admin') return
    if (requestUser.userId  === resourceUserId.toString()) return
    throw new Error('Unauthorized to access this route')
}

module.exports = checkPermissions