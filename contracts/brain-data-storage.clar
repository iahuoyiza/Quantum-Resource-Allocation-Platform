;; Brain Data Storage Contract

(define-map brain-data-records
  { record-id: uint }
  {
    owner: principal,
    data-hash: (buff 32),
    timestamp: uint,
    is-public: bool
  }
)

(define-data-var data-nonce uint u0)

(define-read-only (get-data-record (record-id uint))
  (map-get? brain-data-records { record-id: record-id })
)

(define-public (store-data (data-hash (buff 32)) (is-public bool))
  (let
    (
      (new-id (+ (var-get data-nonce) u1))
    )
    (map-set brain-data-records
      { record-id: new-id }
      {
        owner: tx-sender,
        data-hash: data-hash,
        timestamp: block-height,
        is-public: is-public
      }
    )
    (var-set data-nonce new-id)
    (ok new-id)
  )
)

(define-public (update-data-visibility (record-id uint) (new-visibility bool))
  (let
    (
      (record (unwrap! (map-get? brain-data-records { record-id: record-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get owner record)) (err u403))
    (ok (map-set brain-data-records
      { record-id: record-id }
      (merge record { is-public: new-visibility })))
  )
)

(define-read-only (is-public-data (record-id uint))
  (match (map-get? brain-data-records { record-id: record-id })
    record (ok (get is-public record))
    (err u404)
  )
)

