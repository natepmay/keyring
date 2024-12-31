import { derived, readable, type Readable, writable } from "svelte/store";

export function constStore<T>(v: T) {
  return readable(v, () => {});
}

function arrayWithValueSetAtIndex<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result[index] = item;
  return result;
}

function readOnly<T>(store: Readable<T>): Readable<T> {
  return derived(store, (v) => v);
}

export function unite<Item>(itemStores: Readable<Item>[]): Readable<Item[]> {
  const resultsStore = writable<Item[]>([]);
  itemStores.forEach((itemStore, index) => {
    // TODO handle unsubscribe
    itemStore.subscribe((item) => {
      resultsStore.update((results) =>
        arrayWithValueSetAtIndex(results, index, item)
      );
    });
  });
  return readOnly(resultsStore);
}

export function collapse<Item>(
  outerItemStore: Readable<Readable<Item>>
): Readable<Item> {
  type InitialValue = {};
  const initialValue: InitialValue = {};
  const resultStore = writable<Item | InitialValue>(initialValue);
  function isInitialValue(v: Item | InitialValue): v is InitialValue {
    return v === initialValue;
  }

  // TODO handle unsubscribe
  outerItemStore.subscribe((innerItemStore) => {
    innerItemStore.subscribe((innerItem) => {
      resultStore.set(innerItem);
    });
  });

  return derived(resultStore, (result) => {
    if (isInitialValue(result)) {
      throw new Error("Collapse result value was never set");
    }
    return result;
  });
}

export function mapStores<OuterItem, InnerItem>(
  outerItemsStore: Readable<OuterItem[]>,
  getInnerItemStore: (i: OuterItem) => Readable<InnerItem>
): Readable<InnerItem[]> {
  return collapse(
    derived(outerItemsStore, (outerItems) =>
      unite(outerItems.map(getInnerItemStore))
    )
  );
}

export function filterStores<OuterItem>(
  outerItemsStore: Readable<OuterItem[]>,
  filter: (t: OuterItem) => Readable<boolean>
): Readable<OuterItem[]> {
  return collapse(
    derived(outerItemsStore, (outerItems) => {
      const verdictStores = outerItems.map(filter);
      const verdictsStore = unite(verdictStores);
      return derived(verdictsStore, (verdicts) => {
        return outerItems.filter((_, index) => verdicts[index]);
      });
    })
  );
}
