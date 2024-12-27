;; BCI Marketplace Contract

(define-map bci-applications
  { app-id: uint }
  {
    developer: principal,
    name: (string-ascii 50),
    description: (string-utf8 500),
    price: uint,
    active: bool
  }
)

(define-map user-apps
  { user: principal, app-id: uint }
  {
    purchase-time: uint
  }
)

(define-data-var app-nonce uint u0)

(define-public (list-application (name (string-ascii 50)) (description (string-utf8 500)) (price uint))
  (let
    (
      (new-id (+ (var-get app-nonce) u1))
    )
    (map-set bci-applications
      { app-id: new-id }
      {
        developer: tx-sender,
        name: name,
        description: description,
        price: price,
        active: true
      }
    )
    (var-set app-nonce new-id)
    (ok new-id)
  )
)

(define-public (update-application-status (app-id uint) (active bool))
  (let
    (
      (app (unwrap! (map-get? bci-applications { app-id: app-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get developer app)) (err u403))
    (ok (map-set bci-applications
      { app-id: app-id }
      (merge app { active: active })))
  )
)

(define-public (purchase-application (app-id uint))
  (let
    (
      (app (unwrap! (map-get? bci-applications { app-id: app-id }) (err u404)))
    )
    (asserts! (get active app) (err u400))
    (try! (stx-transfer? (get price app) tx-sender (get developer app)))
    (ok (map-set user-apps
      { user: tx-sender, app-id: app-id }
      {
        purchase-time: block-height
      }))
  )
)

(define-read-only (get-application (app-id uint))
  (map-get? bci-applications { app-id: app-id })
)

(define-read-only (get-user-application (user principal) (app-id uint))
  (map-get? user-apps { user: user, app-id: app-id })
)

