import { useTranslation } from 'react-i18next'

function MyContainer() {
    const { t } = useTranslation()

    return (
        <>
            <div>
                {t('This is the front page.')}
            </div>
        </>
    )
}

export default MyContainer