;; Neuro Reward Token Contract

(define-fungible-token neuro-token)

(define-data-var token-uri (string-utf8 256) u"https://example.com/metadata/neuro-token")

(define-constant contract-owner tx-sender)

(define-map user-achievements
  { user: principal }
  { total-rewards: uint }
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ft-mint? neuro-token amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (ft-transfer? neuro-token amount sender recipient)
  )
)

(define-public (reward-achievement (user principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (try! (ft-mint? neuro-token amount user))
    (map-set user-achievements
      { user: user }
      { total-rewards: (+ (default-to u0 (get total-rewards (map-get? user-achievements { user: user }))) amount) }
    )
    (ok true)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance neuro-token account))
)

(define-read-only (get-total-rewards (user principal))
  (default-to u0 (get total-rewards (map-get? user-achievements { user: user })))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ok (var-set token-uri new-uri))
  )
)

