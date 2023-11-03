import { HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { AiOutlineCheck } from '@react-icons/all-files/Ai/AiOutlineCheck'
import { AiOutlineClose } from '@react-icons/all-files/Ai/AiOutlineClose'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { FetchCartItemsQuery } from '../../../graphql'
import Image from '../../Image/Image'
import List, { ListItem } from '../../List/List'
import Price from '../../Price/Price'

type Props = {
  cartItems: NonNullable<FetchCartItemsQuery['offerOpenSales']>['nodes']
  chain: { id: number; name: string; image: string }
}

const CartTransactionStep: FC<Props> = ({ cartItems, chain }) => {
  const { setValue, watch } = useFormContext()
  const currencies = watch('currencies')

  const uniqueCurrencies = useMemo(() => {
    const currencies: {
      id: string
      decimals: number
      symbol: string
      approved: boolean
    }[] = []
    cartItems?.forEach((item) => {
      !currencies.some((currency) => item.currency.id === currency.id) &&
        currencies.push({ ...item.currency, approved: false })
    })
    return currencies
  }, [cartItems])

  useEffect(() => {
    if (
      currencies === undefined &&
      uniqueCurrencies &&
      uniqueCurrencies.length > 0
    ) {
      setValue('currencies', uniqueCurrencies)
    }
  }, [currencies, setValue, uniqueCurrencies])

  return (
    <VStack px={2} alignItems="flex-start" width="full" spacing={3}>
      <HStack gap={1}>
        <Text variant="subtitle2">Summary</Text>
        <Image
          src={chain.image}
          alt={chain.name}
          width={16}
          height={16}
          h={4}
          w={4}
          ml={1}
        />
      </HStack>
      <List width="full">
        {uniqueCurrencies.map((currency, i) => (
          <ListItem
            key={i}
            label={
              <Price
                amount={cartItems
                  .filter((item) => item.currency.id === currency.id)
                  .reduce(
                    (acc, item) => acc.add(BigNumber.from(item.unitPrice)),
                    BigNumber.from(0),
                  )}
                currency={currency}
              />
            }
            action={
              currency.approved ? (
                <Icon as={AiOutlineCheck} color="green.400" />
              ) : (
                <Icon as={AiOutlineClose} color="red.400" />
              )
            }
            p={0}
          />
        ))}
      </List>
    </VStack>
  )
}

export default CartTransactionStep
