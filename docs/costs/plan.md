# Pinecone

![Pinecone](./pinecone.png)

- $0.0111/hour per s1 pod (aws)
- 2.5 mill vectors per s1 pod (1536 vector size)
- pdf mit 19000 tokens -> 76 vectors
  => 2.5 mill / 76 = 328.947 \*

Number of vectors produced = Number of tokens \* Vector size / Embedding size

76 = 101080 \* 1536 / x

embedding size = 384000
