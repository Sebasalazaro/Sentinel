output "queue_url" {
    value = aws_sqs_queue.trivy_scan_queue.url
}

output "queue_arn" {
    value = aws_sqs_queue.trivy_scan_queue.arn
}
