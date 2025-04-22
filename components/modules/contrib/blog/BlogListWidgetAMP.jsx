import React from "react"
import { BlogCardAMP } from "./BlogCardAMP"
import { normalizeNodes } from "./normalizer"
import { EmptyBlock } from "@/ui"
import { useCollectionContext, useCollectionFetcher } from "@vactorynext/core/hooks"

export const config = {
	id: "vactory_blog:list",
}

const BlogListWidgetAMP = ({ data }) => {
	const context = useCollectionContext(data)
	// Fetch data based on params filters.
	const collection = useCollectionFetcher({
		type: "node",
		bundle: "vactory_blog",
		initialPosts: context.nodes,
		initialPostsCount: context.count,
		//params: filters,
	})

	// Format nodes.
	const posts = normalizeNodes(collection.posts)

	return (
		<div>
			<div className="relative pb-4 pt-4 lg:pb-10 lg:pt-10">
				{posts.length > 0 ? (
					<div className="mx-auto grid gap-5 lg:grid-cols-2">
						{posts.map((post) => (
							<React.Fragment key={post.id}>
								<BlogCardAMP {...post} />
							</React.Fragment>
						))}
					</div>
				) : (
					<EmptyBlock />
				)}
			</div>
		</div>
	)
}

export default BlogListWidgetAMP
