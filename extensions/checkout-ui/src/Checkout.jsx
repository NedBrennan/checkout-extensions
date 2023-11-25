import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useCartLineTarget,
  useSubtotalAmount,
  useShippingAddress,
  List,
  ListItem,
  Image,
  ProductThumbnail,
  HeadingGroup,
  Heading,
  Grid,
  Button,
  useApplyCartLinesChange,
} from '@shopify/ui-extensions-react/checkout';
import { GridItem } from '@shopify/ui-extensions/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <ExtensionItems />,
);


function CartItems() {
  //const {
  //  merchandise: {title},
  //} = useCartLineTarget();
  //console.log(merchandise)

  //let cost = useSubtotalAmount()
  //console.log("COST :", cost)
  //return <Banner title="checkout-ui"> { cost.amount > 0 ? "Line item title:" : "No" }</Banner>;
}


function ExtensionItems() {

  const applyCartLinesChange = useApplyCartLinesChange()
  const onClickAddToCart = async (id) => {
    let result = await applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: id,
      quantity: 1
    })
  }

  const [data, setData] = useState();
  const {query} = useApi();

  useEffect(() => {
    query(
      `query ($first: Int!) {
        products(first: $first) {
          nodes {
            id
            title
            featuredImage {
              id
              url
            }
            variants(first: 1) {
              nodes {
                id
              }
            }
          }
        }
      }`,
      {
        variables: {first: 3},
      },
    )
      .then(({data, errors}) => setData(data))
      .catch(console.error);
  }, [query]);

  console.log("DATA: ", data)

  return (
    <Grid
      columns={['fill', 'fill', 'fill']}
      spacing="tight"
    >
      {data?.products?.nodes.map((node) => (
<GridItem>
        <HeadingGroup>
        <Heading>{node.title}</Heading>
        </HeadingGroup>
        <Image
          source={`${node.featuredImage.url}`}
        />
        <Button onPress={() => onClickAddToCart(node.variants.nodes[0].id)}>Add to Cart</Button>
        </GridItem>
      ))}
    </Grid>
  );
}

function Extension() {

  let api = useApi()
  console.log(api)

  return (
    <Banner title="checkout-ui">
      Hello
    </Banner>
  );
}
