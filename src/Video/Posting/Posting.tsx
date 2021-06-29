import SocialMediaAccounts from "../../Entity/Account/SocialMediaAccounts";
import SocialMediaType from "../../Entity/Account/SocialMediaType";
import {Button, capitalize} from "@material-ui/core";
import SocialAccount from "../../Entity/Account/SocialMediaAccount";
import {useMemo, useState} from "react";
import TikTokModalForm from "./TikTokModalForm";

interface PostingProps {
    socialMediaAccounts: SocialMediaAccounts
}

export default function Posting({socialMediaAccounts}: PostingProps): JSX.Element {

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

    const handleTikTokFormClose = () => {
        closeForm()
    }

    return <>
        <h1>Post the video to</h1>
        {socialMediaTypes.map((socialMediaType: SocialMediaType, socialMediaIndex: number) => (
            <div key={socialMediaIndex}>
                {socialMediaAccounts[socialMediaType].map((socialMediaAccount: SocialAccount, socialMediaIndex: number) => (
                    <Button
                        key={socialMediaIndex}
                        variant="contained"
                        color="primary"
                        onClick={e => handlePostClick(socialMediaType, socialMediaAccount)}
                    >
                        {capitalize(socialMediaType)} {socialMediaAccount.username}
                    </Button>
                ))}
            </div>
        ))}
        <TikTokModalForm onClose={handleTikTokFormClose} open={tikTokModalFormOpen} />
    </>
}