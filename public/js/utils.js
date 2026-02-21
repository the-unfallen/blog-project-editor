export function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
