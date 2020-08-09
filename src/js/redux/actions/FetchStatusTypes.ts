/**
 * Contains collection of possible states a fech request can end with.
 * @type {{success: string, warning: string, error: string}}
 */
enum FetchStatusType {
    success = 'success',
    error = 'error',
    warning = 'warning',
};

export default FetchStatusType;