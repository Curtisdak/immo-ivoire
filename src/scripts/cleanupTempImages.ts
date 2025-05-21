// scripts/cleanupTempImages.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const TEN_MINUTES = 10 * 60 * 1000;

async function deleteOldTempImages() {
    try {
        const now = Date.now();
        let nextCursor = undefined;
        let totalDeleted = 0;

        do {
            const result = await cloudinary.search
                .expression("folder:temp AND resource_type:image")
                .sort_by("created_at", "asc")
                .max_results(100)
                .next_cursor(nextCursor)
                .execute();

            const oldImages = result.resources.filter((img) => {
                const createdAt = new Date(img.created_at).getTime();
                return now - createdAt > TEN_MINUTES;
            });

            if (oldImages.length > 0) {
                const publicIds = oldImages.map((img) => img.public_id);
                const deleted = await cloudinary.api.delete_resources(publicIds);
                console.log("✅ Unused images after 10 minutes has been deleted :", deleted);
                totalDeleted += publicIds.length;
            }

            nextCursor = result.next_cursor;
        } while (nextCursor);

        console.log(`✅ Total deletion : ${totalDeleted} image(s)`);
    } catch (error) {
        console.error("❌ Error during deletion :", error);
    }
}

deleteOldTempImages();