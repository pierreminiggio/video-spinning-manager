import SocialMediaAccounts from "../../Entity/Account/SocialMediaAccounts";
import SocialMediaType from "../../Entity/Account/SocialMediaType";
import {Button, capitalize} from "@material-ui/core";
import SocialAccount from "../../Entity/Account/SocialMediaAccount";
import {useMemo, useState} from "react";
import TikTokModalForm from "./TikTokModalForm";
import NullableString from "../../Struct/NullableString";
import baseUrl from "../../API/Spinner/baseUrl";
import AccountPost from "../../Entity/Video/Social/AccountPost";

interface PostingProps {
    videoId: number
    token: string
    socialMediaAccounts: SocialMediaAccounts
    postedOnAccounts: AccountPost[]
}

export default function Posting({videoId, token, socialMediaAccounts, postedOnAccounts}: PostingProps): JSX.Element {

    const [selectedSocialMediaType, setSelectedSocialMediaType] = useState<SocialMediaType|null>(null)
    const [selectedSocialMediaAccount, setSelectedSocialMediaAccount] = useState<SocialAccount|null>(null)

    const socialMediaTypes = useMemo<SocialMediaType[]>(
        (): SocialMediaType[] => Object.keys(socialMediaAccounts) as SocialMediaType[],
        [socialMediaAccounts]
    )

    const handlePostClick = useMemo<(socialMediaType: SocialMediaType, socialMediaAccount: SocialAccount) => void>(
        () => (socialMediaType: SocialMediaType, socialMediaAccount: SocialAccount): void => {
            setSelectedSocialMediaType(socialMediaType)
            setSelectedSocialMediaAccount(socialMediaAccount)
        },
        [setSelectedSocialMediaType, setSelectedSocialMediaAccount]
    )

    const tikTokModalFormOpen = useMemo<boolean>(
        (): boolean => selectedSocialMediaType === SocialMediaType.TIKTOK,
        [selectedSocialMediaType]
    )

    const closeForm = useMemo<() => void>(
        () => (): void => {
            setSelectedSocialMediaType(null)
            setSelectedSocialMediaAccount(null)
        },
        [setSelectedSocialMediaType, setSelectedSocialMediaAccount]
    )

    const postToTikTok = useMemo<(accountId: number, legend: string, publishAt: string) => void>(() => (accountId: number, legend: string, publishAt: string): void => {
        if (token === null) {
            return
        }

        fetch(
	    baseUrl + '/post-to-tiktok/' + videoId,
            {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }),
		        body: JSON.stringify({
                    accountId, legend, publishAt
                })
            }
        ).then(response => {
            if (response.status !== 204) {
                return
            }
        }).catch(error => {
            // error
        })
    }, [videoId, token])

    const handleTikTokFormClose = useMemo<(legend: NullableString, publishAt: NullableString) => void>(
        () => (legend: NullableString, publishAt: NullableString): void => {

            if (legend !== null && publishAt !== null && selectedSocialMediaAccount !== null) {
                postToTikTok(selectedSocialMediaAccount.id, legend, publishAt)
            }

            closeForm()
        },
        [closeForm, selectedSocialMediaAccount, postToTikTok]
    )

    return <>
        <h1>Post the video to</h1>
        {socialMediaTypes.map((socialMediaType: SocialMediaType, socialMediaIndex: number) => (
            <div key={socialMediaIndex}>
                {socialMediaAccounts[socialMediaType].map((socialMediaAccount: SocialAccount, socialMediaIndex: number) => {
                    const socialMediaAccountId = socialMediaAccount.id
                    const accountPost = postedOnAccounts.find(({accountId}) => accountId === socialMediaAccountId)

                    return accountPost ? (
                        accountPost.remoteUrl !== null ? <div>
                            <a href={accountPost.remoteUrl} target="_blank">Posted on {capitalize(socialMediaType)} {socialMediaAccount.username}</a>
                        </div> : <div>
                            Planified to be posted on {capitalize(socialMediaType)} {socialMediaAccount.username}
                        </div>
                    ) : (
                        <Button
                            key={socialMediaIndex}
                            variant="contained"
                            color="primary"
                            onClick={e => handlePostClick(socialMediaType, socialMediaAccount)}
                        >
                            {capitalize(socialMediaType)} {socialMediaAccount.username}
                        </Button>
                    )
                })}
            </div>
        ))}
        <TikTokModalForm
            onClose={handleTikTokFormClose}
            open={tikTokModalFormOpen}
            predictedNextPostTime={selectedSocialMediaAccount?.predictedNextPostTime ?? null}
        />
    </>
}
