const CourseCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-video bg-gray-200" />

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded-lg w-full" />
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                </div>

                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded-lg w-20" />
                    <div className="h-4 bg-gray-200 rounded-lg w-16" />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <div className="h-6 bg-gray-200 rounded-lg w-16" />
                    <div className="h-5 bg-gray-200 rounded-lg w-12" />
                </div>
            </div>
        </div>
    );
};

export default CourseCardSkeleton;