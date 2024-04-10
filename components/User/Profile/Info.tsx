import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useIsLoggedIn } from '@liteflow/react'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import { HiOutlineGlobeAlt } from '@react-icons/all-files/hi/HiOutlineGlobeAlt'
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram'
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { AccountVerificationStatus } from '../../../graphql'
import Link from '../../Link/Link'
import MarkdownViewer from '../../MarkdownViewer'
import WalletAddress from '../../Wallet/Address'

type Props = {
  address: string
  user:
    | {
        name: string | null
        description: string | null
        twitter: string | null
        instagram: string | null
        website: string | null
        verification: {
          status: AccountVerificationStatus
        } | null
      }
    | null
    | undefined
  loginUrlForReferral?: string
}

const UserProfileInfo: FC<Props> = ({ address, user }) => {
  const { t } = useTranslation('components')
  if (!address) throw new Error('account is falsy')
  const ownerLoggedIn = useIsLoggedIn(address)
  return (
    <VStack as="aside" spacing={8} align="flex-start" px={6}>
      {user?.name && (
        <Box>
          <Heading
            as="h1"
            variant="title"
            color="brand.black"
            wordBreak="break-word"
          >
            {user.name}
          </Heading>
          {user?.verification?.status === 'VALIDATED' && (
            <Flex color="brand.500" mt={2} align="center" gap={1}>
              <Icon as={HiBadgeCheck} /> <span>{t('user.info.verified')}</span>
            </Flex>
          )}
        </Box>
      )}
      <Button variant="outline" colorScheme="gray">
        <WalletAddress address={address} isCopyable isShort />
      </Button>

      {ownerLoggedIn && (
        <Button
          as={Link}
          href={`/account/edit`}
          variant="outline"
          colorScheme="gray"
        >
          <Text as="span" isTruncated>
            {t('user.info.edit')}
          </Text>
        </Button>
      )}

      {user?.description && (
        <Stack spacing={3}>
          <Heading as="h4" variant="heading2" color="brand.black">
            {t('user.info.bio')}
          </Heading>
          <Text
            as="div"
            variant="text-sm"
            color="gray.500"
            whiteSpace="pre-wrap"
          >
            <MarkdownViewer source={user.description} />
          </Text>
        </Stack>
      )}

      {(user?.twitter || user?.instagram || user?.website) && (
        <VStack as="nav" spacing={3} align="flex-start">
          {user?.twitter && (
            <Button
              as={Link}
              href={`https://twitter.com/${user.twitter}`}
              isExternal
              variant="outline"
              colorScheme="gray"
              w={40}
              justifyContent="space-between"
              rightIcon={<Icon as={SiTwitter} />}
            >
              <Text as="span" isTruncated>
                @{user.twitter}
              </Text>
            </Button>
          )}
          {user?.instagram && (
            <Button
              as={Link}
              href={`https://instagram.com/${user.instagram}`}
              isExternal
              variant="outline"
              colorScheme="gray"
              w={40}
              justifyContent="space-between"
              rightIcon={<Icon as={SiInstagram} />}
            >
              <Text as="span" isTruncated>
                @{user.instagram}
              </Text>
            </Button>
          )}
          {user?.website && (
            <Button
              as={Link}
              href={
                user.website.includes('http')
                  ? user.website
                  : `https://${user.website}`
              }
              isExternal
              variant="outline"
              colorScheme="gray"
              w={40}
              justifyContent="space-between"
              rightIcon={<Icon as={HiOutlineGlobeAlt} />}
            >
              <Text as="span" isTruncated>
                {user.website.replace(/^https?\:\/\//i, '')}
              </Text>
            </Button>
          )}
        </VStack>
      )}
    </VStack>
  )
}

export default UserProfileInfo
