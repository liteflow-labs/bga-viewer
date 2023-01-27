import {
  chakra,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState, VFC } from 'react'
import { convertOwnership } from '../../../convert'
import environment from '../../../environment'
import { useFetchOwnersQuery } from '../../../graphql'
import List, { ListItem } from '../../List/List'
import Pagination from '../../Pagination/Pagination'
import OwnersModalActivator from './ModalActivator'
import OwnersModalItem from './ModalItem'

export type Props = {
  assetId: string
  ownersPreview: {
    address: string
    image: string | null | undefined
    name: string | null | undefined
    verified: boolean
    quantity: string
  }[]
  ownerCount: number
}

const OwnersModal: VFC<Props> = ({ assetId, ownersPreview, ownerCount }) => {
  const { t } = useTranslation('components')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(environment.PAGINATION_LIMIT)
  const { data, loading } = useFetchOwnersQuery({
    variables: {
      assetId,
      limit,
      offset: (page - 1) * limit,
    },
  })
  // Reset pagination when the limit change or the modal visibility changes
  useEffect(() => setPage(1), [limit, isOpen])
  const ChakraPagination = chakra(Pagination)
  return (
    <>
      <OwnersModalActivator
        owners={ownersPreview}
        ownerCount={ownerCount}
        onClick={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex>
              {t('token.owners.title')}
              <Flex
                bgColor="brand.50"
                my="auto"
                ml={3}
                align="center"
                justify="center"
                rounded="lg"
                py={0.5}
                px={2.5}
              >
                <Text as="span" variant="caption" color="brand.500">
                  {ownerCount}
                </Text>
              </Flex>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            maxHeight={{ base: '', md: 'lg' }}
            minHeight={{ base: '', md: 'lg' }}
          >
            <List>
              {loading
                ? new Array(limit)
                    .fill(0)
                    .map((_, index) => (
                      <ListItem
                        key={index}
                        image={<SkeletonCircle />}
                        label={<SkeletonText noOfLines={2} />}
                      />
                    ))
                : data?.ownerships?.nodes
                    .map(convertOwnership)
                    .map((owner) => (
                      <OwnersModalItem key={owner.address} {...owner} />
                    ))}
            </List>
          </ModalBody>
          <ModalFooter>
            <ChakraPagination
              pt="4"
              limit={environment.PAGINATION_LIMIT}
              limits={[environment.PAGINATION_LIMIT]} //, 24, 36, 48]}
              page={page}
              total={data?.ownerships?.totalCount}
              onPageChange={setPage}
              simple
              onLimitChange={(limit) => setLimit(parseInt(limit, 10))}
              result={{
                label: t('pagination.result.label'),
                caption: (props) => (
                  <Trans
                    ns="templates"
                    i18nKey="pagination.result.caption"
                    values={props}
                    components={[
                      <Text as="span" color="brand.black" key="text" />,
                    ]}
                  />
                ),
                pages: (props) =>
                  t('pagination.result.pages', { count: props.total }),
              }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OwnersModal
