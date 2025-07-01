export async function handlerError(err, req, res, next) {
    console.error("Uh oh, spaghetti-o");
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}
