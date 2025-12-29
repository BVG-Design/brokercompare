strong>Budget:</strong> {selectedRequest.monthly_budget || 'Not specified'}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.created_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Partnership Interests */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-[#132847] mb-3">Partnership Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.partnership_interests?.map((interest, idx) => (
                    <Badge key={idx} variant="secondary">
                      {interest.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#132847] mb-3">Message</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              )}

              {/* Status Management */}
              <div>
                <h4 className="font-semibold text-[#132847] mb-3">Status</h4>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => handleStatusChange(selectedRequest, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-[#132847] mb-3">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
                <Button
                  onClick={handleSaveNotes}
                  className="mt-2 bg-[#132847]"
                  disabled={updateRequestMutation.isPending}
                >
                  Save Notes
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <a href={`mailto:${selectedRequest.contact_email}`}>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Contact
                  </Button>
                </a>
                <Button
                  onClick={() => handleStatusChange(selectedRequest, 'contacted')}
                  variant="outline"
                  disabled={selectedRequest.status !== 'pending'}
                >
                  Mark as Contacted
                </Button>
              </div>
            </div>
          )}