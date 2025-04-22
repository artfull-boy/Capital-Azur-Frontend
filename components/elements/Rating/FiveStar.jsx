import React, { useState, useEffect } from "react"
import { Icon } from "@/ui"
import { useAccount } from "@vactorynext/core/hooks"
import ReactStars from "react-stars"
import { ratingChanged } from "@vactorynext/core/utils"

export const FiveStar = ({ id, entity, icon, allowvote, rate }) => {
	const { isAuthenticated } = useAccount()
	const { hasVoted, fivestar, vote } = rate
	const [voteCount, setVoteCount] = useState(fivestar ? fivestar?.vote_count : 0)
	const [average, setAverage] = useState(
		fivestar ? parseFloat(fivestar?.vote_average).toFixed(2) : 0
	)
	const [value, setValue] = useState(vote)
	const [edit, setEdit] = useState(!hasVoted)

	useEffect(() => {
		setEdit(hasVoted)
	}, [hasVoted])

	return (
		<>
			<div className="mt-2 flex items-center">
				<Icon id={icon} className="h-6 w-6  text-warning-400" />
				<span> {average + " "} </span>
				<span> {"( " + voteCount + " avis )"} </span>
			</div>
			{allowvote && isAuthenticated && (
				<ReactStars
					count={5}
					onChange={(newRating) =>
						ratingChanged(
							newRating,
							id,
							entity,
							setValue,
							setAverage,
							setVoteCount,
							setEdit
						)
					}
					size={24}
					half={true}
					activeColor="#ffd700"
					value={parseFloat(value)}
					edit={edit}
				/>
			)}
		</>
	)
}
