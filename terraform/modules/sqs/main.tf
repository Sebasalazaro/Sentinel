resource "aws_sqs_queue" "trivy_scan_queue" {
    name = "trivy-scan-queue"
}

resource "aws_iam_policy" "sqs_send_message_policy" {
    name        = "sqs-send-message-policy"
    description = "Allow sending messages to the SQS queue"
    policy      = jsonencode({
        Version = "2012-10-17"
        Statement = [
        {
            Effect = "Allow"
            Action = "sqs:SendMessage"
            Resource = aws_sqs_queue.trivy_scan_queue.arn
        }
        ]
    })
}
