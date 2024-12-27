;; Neurofeedback Training Contract

(define-map training-programs
  { program-id: uint }
  {
    creator: principal,
    name: (string-ascii 50),
    description: (string-utf8 500),
    duration: uint,
    price: uint,
    active: bool
  }
)

(define-map user-programs
  { user: principal, program-id: uint }
  {
    start-time: uint,
    completed: bool
  }
)

(define-data-var program-nonce uint u0)

(define-public (create-program (name (string-ascii 50)) (description (string-utf8 500)) (duration uint) (price uint))
  (let
    (
      (new-id (+ (var-get program-nonce) u1))
    )
    (map-set training-programs
      { program-id: new-id }
      {
        creator: tx-sender,
        name: name,
        description: description,
        duration: duration,
        price: price,
        active: true
      }
    )
    (var-set program-nonce new-id)
    (ok new-id)
  )
)

(define-public (update-program-status (program-id uint) (active bool))
  (let
    (
      (program (unwrap! (map-get? training-programs { program-id: program-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get creator program)) (err u403))
    (ok (map-set training-programs
      { program-id: program-id }
      (merge program { active: active })))
  )
)

(define-public (enroll-in-program (program-id uint))
  (let
    (
      (program (unwrap! (map-get? training-programs { program-id: program-id }) (err u404)))
    )
    (asserts! (get active program) (err u400))
    (try! (stx-transfer? (get price program) tx-sender (get creator program)))
    (ok (map-set user-programs
      { user: tx-sender, program-id: program-id }
      {
        start-time: block-height,
        completed: false
      }))
  )
)

(define-public (complete-program (program-id uint))
  (let
    (
      (user-program (unwrap! (map-get? user-programs { user: tx-sender, program-id: program-id }) (err u404)))
    )
    (ok (map-set user-programs
      { user: tx-sender, program-id: program-id }
      (merge user-program { completed: true })))
  )
)

(define-read-only (get-program (program-id uint))
  (map-get? training-programs { program-id: program-id })
)

(define-read-only (get-user-program (user principal) (program-id uint))
  (map-get? user-programs { user: user, program-id: program-id })
)

